// token wird per get überreicht
// wird lokal gesetzt

import { Roles, TokenType, useServer } from "~/backend";
import { CompatibilityEvent, createError, sendError, sendRedirect } from "h3";
import jwt from "jsonwebtoken";
import { RegistrationTokenPayload, setSessionToken } from "~/backend/auth";

/**
 * Confirm Registration, which is handled by clicking a link containing a jwt token with username and email
 */

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const query: any = useQuery(event);
  const { prisma } = await useServer();

  if (!query.token) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Verification process requires a token.",
      })
    );
    return;
  }

  let decodedToken: RegistrationTokenPayload;

  try {
    decodedToken = jwt.verify(query.token, process.env.JWT_SECRET);
  } catch (error) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  if (decodedToken.type !== TokenType.REGISTRATION) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  console.log(
    "[Auth]",
    `Token could be verified for registration attempt of user <${decodedToken.email}>`
  );

  if (await prisma.user.findUnique({ where: { email: decodedToken.email } })) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email: decodedToken.email,
      name: decodedToken.name,
      role: Roles.PARTICIPANT,
    },
  });

  console.log(
    "[Auth]",
    `Registration for use <${decodedToken.email}> confirmed. Prisma user created.`
  );

  await setSessionToken(event, { email: decodedToken.email });

  await sendRedirect(event, "/");
});
