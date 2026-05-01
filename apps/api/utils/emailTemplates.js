/**
 * Email templates for Collaborative Team Hub
 */

const invitationTemplate = (workspaceName, inviterName, joinUrl) => {
  return {
    subject: `You've been invited to join ${workspaceName} on Team Hub`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5;">Workspace Invitation</h2>
        <p>Hello,</p>
        <p><strong>${inviterName}</strong> has invited you to collaborate on the workspace <strong>${workspaceName}</strong>.</p>
        <div style="margin: 30px 0;">
          <a href="${joinUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you don't have an account, you'll be asked to create one first.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Collaborative Team Hub - Streamline your team's workflow.</p>
      </div>
    `,
    text: `${inviterName} has invited you to join ${workspaceName}. Accept here: ${joinUrl}`,
  };
};

const mentionTemplate = (authorName, content, contextType, contextUrl) => {
  const typeLabel = contextType === "ANNOUNCEMENT" ? "an announcement" : "a comment";
  
  return {
    subject: `${authorName} mentioned you in ${typeLabel}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5;">New Mention</h2>
        <p>Hello,</p>
        <p><strong>${authorName}</strong> mentioned you in ${typeLabel}:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0; font-style: italic;">
          "${content}"
        </div>
        <div style="margin: 30px 0;">
          <a href="${contextUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View in Workspace</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Collaborative Team Hub - Streamline your team's workflow.</p>
      </div>
    `,
    text: `${authorName} mentioned you in ${typeLabel}: "${content}". View it here: ${contextUrl}`,
  };
};

module.exports = {
  invitationTemplate,
  mentionTemplate,
};
