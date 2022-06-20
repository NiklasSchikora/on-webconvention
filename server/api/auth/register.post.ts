import { CompatibilityEvent, sendError } from "h3";
import isEmail from "validator/es/lib/isEmail";
import jwt from "jsonwebtoken";
import setupServer, { TokenType, useServer } from "~/backend";
import { RegistrationTokenPayload } from "~/backend/auth";

// token läuft nach 15 Minuten ab, aber Account wird nicht gelöscht. -> d.h. Account automatisch löschen oder erst nach Verifizierung speichern.

type RegistrationEmailProps = { username: string; link: string };

const registrationEmailTemplate = ({
  username,
  link,
}: RegistrationEmailProps) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
  <style type="text/css">
    @media screen {
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 400;
        src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 400;
        src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 500;
        src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 500;
        src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 700;
        src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 700;
        src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 800;
        src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Fira Sans';
        font-style: normal;
        font-weight: 800;
        src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }
    }

    #outlook a {
      padding: 0;
    }

    .ExternalClass,
    .ReadMsgBody {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font {
      line-height: 100%;
    }

    div[style*="margin: 14px 0;"],
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    @media only screen and (min-width:621px) {
      .pc-container {
        width: 620px !important;
      }
    }

    @media only screen and (max-width:620px) {
      .pc-footer-box-s2,
      .pc-footer-box-s4,
      .pc-header-box-s3 .pc-header-box-in {
        padding-left: 30px !important;
        padding-right: 30px !important
      }
      .pc-spacing.pc-m-header-4 td {
        font-size: 53px !important;
        height: 53px !important;
        line-height: 53px !important
      }
      .pc-features-box-s4 {
        padding: 35px 10px 30px !important
      }
      .pc-features-row-s1 .pc-features-row-col {
        max-width: 50% !important
      }
      .pc-content-box-s2 {
        padding: 35px 10px 15px !important
      }
      .pc-cta-box-s14 .pc-cta-box-in {
        padding-bottom: 35px !important;
        padding-top: 35px !important
      }
      .pc-footer-row-s2 .pc-footer-row-col {
        width: 100% !important
      }
      .pc-mobile-text-centered {
        text-align: center !important
      }
      .pc-spacing.pc-m-footer-h-59 td {
        font-size: 20px !important;
        height: 20px !important;
        line-height: 20px !important
      }
    }

    @media only screen and (max-width:525px) {
      .pc-header-box-s3 .pc-header-box-in {
        padding: 25px 20px 20px !important
      }
      .pc-spacing.pc-m-header-4 td {
        font-size: 43px !important;
        height: 43px !important;
        line-height: 43px !important
      }
      .pc-header-cta-s2 .pc-header-cta-title {
        font-size: 30px !important;
        line-height: 1.42 !important
      }
      .pc-cta-text br,
      .pc-cta-title br,
      .pc-footer-text-s2 br,
      .pc-header-cta-text br,
      .pc-header-cta-title br {
        display: none !important
      }
      .pc-features-box-s4 {
        padding: 25px 0 20px !important
      }
      .pc-features-row-s1 .pc-features-row-col {
        max-width: 100% !important
      }
      .pc-content-box-s2 {
        padding: 25px 0 5px !important
      }
      .pc-cta-box-s14 .pc-cta-box-in,
      .pc-footer-box-s2 {
        padding: 25px 20px !important
      }
      .pc-cta-s1 .pc-cta-title {
        font-size: 24px !important;
        line-height: 1.42 !important
      }
      .pc-footer-box-s4 {
        padding: 15px 20px 25px !important
      }
      .pc-cta-icon.pc-m-module-18 {
        height: auto !important;
        width: 72px !important
      }
      .pc-footer-socials-s2 {
        font-size: 14px !important
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .pc-fb-font{font-family:Helvetica,Arial,sans-serif !important;}
  </style>
  <![endif]-->
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
</head>
<body class="pc-fb-font" bgcolor="#252830" style="background-color: #252830; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100% !important; Margin: 0 !important; padding: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%">
  <table style="width: 100%;" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tbody>
      <tr>
        <td style="padding: 0; vertical-align: top;" align="center" valign="top">
          <!--[if (gte mso 9)|(IE)]>
      <table width="620" align="center" border="0" cellspacing="0" cellpadding="0"><tr><td width="620" align="center" valign="top">
      <![endif]-->
          <table class="pc-container" align="center" style="width: 100%; Margin: 0 auto; max-width: 620px;" width="100%" border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td align="left" style="vertical-align: top; padding: 0 10px;" valign="top"> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">Template created by Designmodo.com</span>
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                    <tbody>
                      <tr>
                        <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;" valign="top">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                  <table style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td>
                          <!-- START MODULE: Header 4 -->
                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                            <tbody>
                              <tr>
                                <td class="pc-header-box-s3" style="vertical-align: top; background-color: #363A45" valign="top" bgcolor="#363A45">
                                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                    <tbody>
                                      <tr>
                                        <td class="pc-header-box-in" style="vertical-align: top; padding: 34px 40px 55px;" valign="top">
                                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                            <tbody>
                                              <tr>
                                                <td align="center" style="vertical-align: top;" valign="top">
                                                  <table border="0" cellpadding="0" cellspacing="0" style="width: 130px;" width="130">
                                                    <tbody>
                                                      <tr>
                                                        <td style="vertical-align: top;" valign="top">
                                                            <a href="http://example.com" style="text-decoration: none;">
                                                                <img src="public/images/background.jpg" width="518" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; display: block; Margin: 0 auto; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; color: #1B1B1B;">
                                                            </a>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="vertical-align: top;" valign="top">
                                                  <table class="pc-spacing pc-m-header-4" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td style="vertical-align: top; height: 61px; line-height: 61px; font-size: 61px;" valign="top">&nbsp;</td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="vertical-align: top;" valign="top">
                                                  <table class="pc-header-cta-s2" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td class="pc-header-cta-title pc-fb-font" style="vertical-align: top; padding: 12px 0 0; text-align: center; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; line-height: 1.28; letter-spacing: -0.6px; color: #ffffff;" valign="top" align="center">Danke für deine Anmeldung <br>auf unserer Eventplattform.</td>
                                                      </tr>
                                                      <tr>
                                                        <td class="pc-header-cta-text pc-fb-font" style="vertical-align: top; padding: 30px 0 0 0; text-align: left; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 300; line-height: 1.56; letter-spacing: -0.2px; color: #ffffff;" valign="top" align="left">
                                                            Hallo ${username}, 
                                                            <br>du hast dich auf unserer Eventplattform angemeldet.*
                                                            <br>Klicke auf folgenden Link, um die Anmeldung abzuschließen:
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td style="vertical-align: top;" valign="top">
                                                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                            <tbody>
                                                              <tr>
                                                                <td style="vertical-align: top; height: 24px; line-height: 24px; font-size: 24px;" valign="top">&nbsp;</td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td style="vertical-align: top; padding: 5px 0;" valign="top" align="center">
                                                          <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">
                                                            <tbody>
                                                              <tr>
                                                                <td style="vertical-align: top;
                                                                           border-radius: 8px;
                                                                           text-align: center;"
                                                                    valign="top" 
                                                                    align="center" >
                                                                 <a href="${link}" 
                                                                    style=" line-height: 1.5; 
                                                                            text-decoration: none;
                                                                            margin: 0; 
                                                                            padding: 13px 17px; 
                                                                            white-space: nowrap; 
                                                                            border-radius: 8px; 
                                                                            font-weight: 500; 
                                                                            display: inline-block; 
                                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif; 
                                                                            font-size: 16px; 
                                                                            cursor: pointer; 
                                                                            background: linear-gradient(150deg, #3B5695 0%, #79F0DA 100%); 
                                                                            color: #ffffff;
                                                                            box-shadow: #151515;">Einloggen
                                                                 </a>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td class="pc-header-cta-text pc-fb-font" style="vertical-align: top; padding: 30px 0 0 0; text-align: center; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 300; line-height: 1.56; letter-spacing: -0.2px; color: #ffffff;" valign="top" align="center">
                                                            *Solltest du dich nicht bei uns angemeldet habe, dann ignoriere diese E-Mail.
                                                        </td>
                                                       </tr>
                                                       <tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- END MODULE: Header 4 -->
                          <!-- START MODULE: Footer 3 -->
                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                            <tbody>
                              <tr>
                                <td class="pc-footer-box-s4" style="vertical-align: top; padding: 31px 40px; background-color: #ffffff" valign="top" bgcolor="#ffffff">
                                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                    <tbody>
                                      <tr>
                                        <td class="pc-footer-row-s2" style="vertical-align: top;" valign="top">
                                          <!--[if (gte mso 9)|(IE)]>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                <td width="260" style="width:260px;" valign="top">
                                          <![endif]-->
                                          <table class="pc-footer-row-col" border="0" cellpadding="0" cellspacing="0" align="left">
                                            <tbody>
                                              <tr>
                                                <td class="pc-footer-text-s2 pc-mobile-text-centered pc-fb-font" style="vertical-align: top; line-height: 1.43; letter-spacing: -0.2px; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; color: #9B9B9B; padding: 10px 0;" valign="top">
                                                  <a style="text-decoration: none; color: #9B9B9B; cursor: text;">Eventplattform
                                                    <br>Web-Engeneering-Projekt ON19 DHBW Mosbach
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                    <tbody>
                                      <tr>
                                        <td class="pc-fb-font" style="vertical-align: top; text-align: center; line-height: 1.43; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; color: #9B9B9B;" valign="top" align="center">
                                          <a href="http://example.com" style="text-decoration: none; color: #1595E7;">Impressum</a>
                                          <span>&nbsp;&nbsp;</span>
                                          <a href="http://example.com" style="text-decoration: none; color: #1595E7;">Datenschutz</a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- END MODULE: Footer 3 -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                    <tbody>
                      <tr>
                        <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;" valign="top">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--[if (gte mso 9)|(IE)]>
      </td></tr></table>
      <![endif]-->
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>
`;

const getVerificationURL = (token: string) =>
  `${process.env.MAIL_HOST}/api/auth/confirm?token=${token}`;

const createToken = ({ name, email }) => {
  let payload: RegistrationTokenPayload = {
    name: name,
    email: email,
    type: TokenType.REGISTRATION,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const sendRegistrationMail = async ({ name, email }) => {
  const { mailer } = await useServer();

  const token = createToken({ name, email });
  const verificationURL = getVerificationURL(token);

  const mailOptions = {
    from: "info@web-engineering.ddev.site",
    html: registrationEmailTemplate({
      username: name,
      link: verificationURL,
    }),
    subject: "Willkommen auf unserer Event-Plattform",
    to: email,
  };

  let info = await mailer.sendMail(mailOptions);
  console.log(
    "[Auth]",
    `Registration request sent to user <${email}> ${info.messageId}`
  );
};

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const { name, email } = await useBody(event);

  if (!name || !email) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Du musst eine E-Mail-Adresse und einen Benutzernamen angeben.",
      })
    );
    return;
  }

  if (!isEmail(email)) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Deine E-Mail-Adresse ist ungültig.",
      })
    );
    return;
  }

  const { prisma } = await useServer();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!existingUser) {
    try {
      await sendRegistrationMail({ name, email });
    } catch (error) {
      console.log("[Auth]", error);
      sendError(
        event,
        createError({
          statusCode: 500,
        })
      );

      return;
    }
  }

  return {
    success: true,
    message:
      "Deine Registrierung verlief erfolgreich. Du erhälst gleich eine E-Mail zur Bestätigung.",
  };
});
