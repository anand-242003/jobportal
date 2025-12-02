import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../config/db.js";
import { generateToken, RefreshToken } from "../utils/generateToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const fullName = profile.displayName;

                let user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            fullName,
                            password: Math.random().toString(36).slice(-8),
                            role: "Student",
                            phoneNumber: "",
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
});

export const googleCallback = (req, res, next) => {
    passport.authenticate("google", async (err, user) => {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        
        if (err || !user) {
            return res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
        }

        try {
            const accessToken = generateToken(user);
            const refreshToken = RefreshToken(user);

            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: refreshToken }
            });

            const isProduction = process.env.NODE_ENV === 'production';

            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 15 * 60 * 1000,
                path: "/",
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });

            const redirectUrl = user.role === "Employer"
                ? `${frontendUrl}/dashboard/employer`
                : `${frontendUrl}/jobs`;

            res.redirect(redirectUrl);
        } catch (error) {
            console.error("OAuth Error:", error);
            res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
        }
    })(req, res, next);
};
