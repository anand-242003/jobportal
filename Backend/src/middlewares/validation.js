export const validateSignup = (req, res, next) => {
  const { fullName, email, password, phoneNumber } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long");
  }

  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!phoneNumber) {
    errors.push("Phone number is required");
  } else {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      errors.push("Phone number must be 10 digits");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export const validateJobCreation = (req, res, next) => {
  const { title, description, salary, location, jobType, experienceLevel, position } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Job title must be at least 3 characters long");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Job description must be at least 10 characters long");
  }

  if (!salary) {
    errors.push("Salary is required");
  }

  if (!location) {
    errors.push("Location is required");
  }

  if (!jobType) {
    errors.push("Job type is required");
  }

  if (!experienceLevel || isNaN(experienceLevel) || experienceLevel < 0) {
    errors.push("Valid experience level is required");
  }

  if (!position || isNaN(position) || position < 1) {
    errors.push("Number of positions must be at least 1");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { fullName, phoneNumber } = req.body;
  const errors = [];

  if (fullName && fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long");
  }

  if (phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      errors.push("Phone number must be 10 digits");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
