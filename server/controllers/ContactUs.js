// controllers/ContactUs.js
const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes");

exports.contactUs = async (req, res) => {
  const { firstName, lastName, email, message, phoneNo, countrycode } =
    req.body;

  if (!firstName || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }

  try {
    // Send email to admin
    const adminEmailContent = `<html><body>${Object.entries({
      firstName,
      lastName: lastName || "Not provided",
      email,
      phoneNo: phoneNo || "Not provided",
      message,
    })
      .map(([key, value]) => `<p>${key}: ${value}</p>`)
      .join("")}</body></html>`;

    const adminInfo = await mailSender(
      process.env.CONTACT_MAIL,
      "New Contact Form Submission",
      adminEmailContent
    );

    // Send confirmation email to user
    const userEmailContent = contactUsEmail(
      email,
      firstName,
      lastName || "",
      message,
      phoneNo || "",
      countrycode || ""
    );

    const userInfo = await mailSender(
      email,
      "Thank you for contacting us",
      userEmailContent
    );

    if (adminInfo && userInfo) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      });
    } else {
      throw new Error("Email sending failed");
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
