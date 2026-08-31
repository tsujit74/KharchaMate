import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.js";
import AuthIdentity from "../models/AuthIdentity.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account does not have an email"), null);
        }

        const googleId = profile.id;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value || null;

        let identity = await AuthIdentity.findOne({
          provider: "google",
          providerAccountId: googleId,
        });

        if (identity) {
          const user = await User.findById(identity.userId);

          if (!user) {
            return done(new Error("User account not found"), null);
          }

          if (user.isBlocked) {
            return done(
              new Error("Your account has been blocked by admin"),
              null,
            );
          }

          user.lastLoginAt = new Date();

          if (avatar) {
            user.avatar = avatar;
          }

          await user.save();

          return done(null, user);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (user.isBlocked) {
            return done(
              new Error("Your account has been blocked by admin"),
              null,
            );
          }

          user.lastLoginAt = new Date();

          if (avatar) {
            user.avatar = avatar;
          }

          await user.save();
        } else {
          user = await User.create({
            name,
            email,
            password: null,
            avatar,
            lastLoginAt: new Date(),
          });
        }

        await AuthIdentity.create({
          userId: user._id,
          provider: "google",
          providerAccountId: googleId,
        });

        return done(null, user);
      } catch (error) {
        console.error("Google authentication error:", error);
        return done(error, null);
      }
    },
  ),
);

export default passport;
