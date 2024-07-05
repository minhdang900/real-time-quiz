import { randomUUID } from 'crypto';
import { DocQueue, DocQueueDetail } from '../domain/entity';
import { CreateDocQueueDetailPortDto, CreateDocQueuePortDto } from '../port/dto';
import { DocQueueStatus } from 'src/infra/postgres/enum';

export function toCreateDocQueuePort(docQueue: DocQueue): CreateDocQueuePortDto {
  return new CreateDocQueuePortDto({
    id: docQueue.id || randomUUID(),
    queueNumber: docQueue.queueNumber,
    bookingNumber: docQueue.bookingNumber,
    isEsiAttached: docQueue.isEsiAttached,
    isEmailSiAttached: docQueue.isEmailSiAttached,
    totalSi: docQueue.totalSi,
    priority: docQueue.priority,
    picId: docQueue.picId,
    siKind: docQueue.siKind,
    isBlDocumentInput: docQueue.isBlDocumentInput,
    isBlRate: docQueue.isBlRate,
    isBlAudit: docQueue.isBlAudit,
    isBlDraftFaxOut: docQueue.isBlDraftFaxOut,
    siProcessingStatus: docQueue.siProcessingStatus,
    siSourceChannel: docQueue.siSourceChannel,
    processingTool: docQueue.processingTool,
    esiUploadStatus: docQueue.esiUploadStatus,
    shineUploadStatus: docQueue.shineUploadStatus,
    queueRemark: docQueue.queueRemark,
    timeLeftCategory: docQueue.timeLeftCategory,
    splitStatusCode: docQueue.splitStatusCode,
    siReceivedAt: docQueue.siReceivedAt,
    siTransferredAt: docQueue.siTransferredAt,
    queueStatus: docQueue.queueStatus || DocQueueStatus.TimeLeftProcessing,
    timeLeft: null,
    deadline: null,
    deadlineGmt: null,
    amsDue: null,
    amsDeadline: null,
    amsDeadlineGmt: null,
    timeLeftRuleId: null,
    timeLeftRuleIdAms: null,
    externalRequestNumber: docQueue.externalRequestNumber,
    externalRequestSequence: docQueue.externalRequestSequence,
    externalSenderId: docQueue.externalSenderId,
    siSource: docQueue.siSource,
    createdAt: docQueue.createdAt || new Date(),
    createdBy: docQueue.createdBy,
    updatedAt: docQueue.updatedAt || new Date(),
    updatedBy: docQueue.updatedBy,
  });
}

export function toCreateDocQueueDetailPort(docQueueDetail: DocQueueDetail): CreateDocQueueDetailPortDto {
  return new CreateDocQueueDetailPortDto({
    id: docQueueDetail.id || randomUUID(),
    queueNumber: docQueueDetail.queueNumber,
    docQueueId: docQueueDetail.docQueueId,
    bookingNumber: docQueueDetail.bookingNumber,
    isEsiAttached: docQueueDetail.isEsiAttached,
    isEmailSiAttached: docQueueDetail.isEmailSiAttached,
    siHistory: docQueueDetail.siHistory,
    priority: docQueueDetail.priority,
    picId: docQueueDetail.picId,
    siKind: docQueueDetail.siKind,
    isBlDocumentInput: docQueueDetail.isBlDocumentInput,
    isBlRate: docQueueDetail.isBlRate,
    isBlAudit: docQueueDetail.isBlAudit,
    isBlDraftFaxOut: docQueueDetail.isBlDraftFaxOut,
    siProcessingStatus: docQueueDetail.siProcessingStatus,
    siSourceChannel: docQueueDetail.siSourceChannel,
    processingTool: docQueueDetail.processingTool,
    esiUploadStatus: docQueueDetail.esiUploadStatus,
    shineUploadStatus: docQueueDetail.shineUploadStatus,
    queueRemark: docQueueDetail.queueRemark,
    timeLeftCategory: docQueueDetail.timeLeftCategory,
    splitStatusCode: docQueueDetail.splitStatusCode,
    siReceivedAt: docQueueDetail.siReceivedAt,
    siTransferredAt: docQueueDetail.siTransferredAt,
    queueStatus: docQueueDetail.queueStatus,
    externalRequestNumber: docQueueDetail.externalRequestNumber,
    externalRequestSequence: docQueueDetail.externalRequestSequence,
    externalSenderId: docQueueDetail.externalSenderId,
    siSource: docQueueDetail.siSource,
    createdAt: docQueueDetail.createdAt || new Date(),
    createdBy: docQueueDetail.createdBy,
    updatedAt: docQueueDetail.updatedAt || new Date(),
    updatedBy: docQueueDetail.updatedBy,
  });
}

export function toCreateDocQueueDetailPortList(docQueueDetailList: DocQueueDetail[]): CreateDocQueueDetailPortDto[] {
  return docQueueDetailList.map((docQueueDetail) => toCreateDocQueueDetailPort(docQueueDetail));
}
