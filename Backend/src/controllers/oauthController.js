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
            passReqToCallback: false,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const fullName = profile.displayName;
                const googleId = profile.id;

                // Find existing user by email OR Google ID
                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: email },
                            { providerId: googleId, provider: "google" }
                        ]
                    }
                });

                if (!user) {
                    // Create new user for OAuth
                    user = await prisma.user.create({
                        data: {
                            email,
                            fullName,
                            password: Math.random().toString(36).slice(-8), // Random password for OAuth users
                            role: "Student",
                            phoneNumber: null, // OAuth users don't have phone initially
                            provider: "google",
                            providerId: googleId,
                            isVerified: true, // Google users are pre-verified
                        },
                    });
                } else if (!user.provider || !user.providerId) {
                    // Update existing email-based user with OAuth info
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            provider: "google",
                            providerId: googleId,
                            isVerified: true,
                        }
                    });
                }

                return done(null, user);
            } catch (error) {
                console.error("❌ OAuth Error:", error);
                return done(error, null);
            }
        }
    )
);

export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent"
});

export const googleCallback = (req, res, next) => {
    passport.authenticate("google", async (err, user) => {
        const frontendUrl = process.env.FRONTEND_URL;

        // Enhanced logging for production debugging
        console.log("=== OAuth Callback Debug ===");
        console.log("Timestamp:", new Date().toISOString());
        console.log("Error:", err);
        console.log("User:", user ? { id: user.id, email: user.email } : "No user");
        console.log("Frontend URL:", frontendUrl);
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);
        console.log("========================");

        if (!frontendUrl) {
            console.error("❌ FRONTEND_URL not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }

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

            const redirectUrl = `${frontendUrl}/auth/oauth-success?token=${accessToken}&refreshToken=${refreshToken}&role=${user.role}`;

            res.redirect(redirectUrl);
        } catch (error) {
            console.error("OAuth Error:", error);
            res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
        }
    })(req, res, next);
};
