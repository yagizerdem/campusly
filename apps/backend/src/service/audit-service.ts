import { PrismaAPIFeatures } from "@common/prisma-api-features.js";
import { AppError } from "@common/app-error.js";
import { prisma } from "@lib/prisma.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";

export async function getAuditLogsOfUser(
  userId: string,
  query: Record<string, string | undefined>,
) {
  const apiFeatures = new PrismaAPIFeatures(
    (query ?? {}) as Record<string, string | undefined>,
  );

  const features = apiFeatures
    .filter()
    .sort()
    .selectFields()
    .paginate()
    .build();

  const audits = await prisma.auditLogs.findMany({
    ...features,
    where: {
      ...features.where,
      actorId: userId,
    },
  });

  return audits;
}

export async function getAuditLogById(auditLogId: string) {
  const auditLog = await prisma.auditLogs.findUnique({
    where: {
      id: auditLogId,
    },
  });

  return auditLog;
}

export async function ensureAuditLogExistById(auditLogId: string) {
  const auditLog = await getAuditLogById(auditLogId);

  if (!auditLog) {
    throw AppError.from({
      machineCode: ErrorMachineCode.AUDIT_LOG_NOT_FOUND,
      message: "Audit log not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return auditLog;
}

export async function removeAuditLogById(auditLogId: string) {
  await ensureAuditLogExistById(auditLogId);

  return prisma.auditLogs.delete({
    where: {
      id: auditLogId,
    },
  });
}
