export * from './src/schema/generated-schema-types';
export { ActionType, ActionResultType } from './src/batch-client/types';
export declare enum MailFolderView {
    conversation = "conversation",
    message = "message"
}
export declare enum MessageFlags {
    unread = "u",
    flagged = "f",
    hasAttachment = "a",
    replied = "r",
    sentByMe = "s",
    forwarded = "w",
    calendarInvite = "v",
    draft = "d",
    imapDeleted = "x",
    notificationSent = "n",
    urgent = "!",
    lowPriority = "?",
    priority = "+"
}
export declare enum ActionOps {
    update = "update",
    delete = "delete",
    read = "read",
    unread = "!read",
    flag = "flag",
    unflag = "!flag",
    tag = "tag",
    untag = "!tag",
    move = "move",
    spam = "spam",
    unspam = "!spam",
    trash = "trash",
    copy = "copy"
}
export declare enum _MessageActionOps {
    update = "update"
}
export declare type MessageActionOps = ActionOps | _MessageActionOps;
export declare enum _ConversationActionOps {
    priority = "priority"
}
export declare type ConversationActionOps = ActionOps | _ConversationActionOps;
