// functions/src/index.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const onNewForumPost = onDocumentCreated('forum_posts/{postId}', async (event) => {
  const post = event.data?.data();
  if (!post) return;

  await transporter.sendMail({
    from: `"Pace Edizioni" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Nuovo post in attesa di approvazione: "${post.title}"`,
    html: `
      <p>L'autore <strong>${post.authorName}</strong> ha inviato un nuovo post.</p>
      <p><strong>Titolo:</strong> ${post.title}</p>
      <p><strong>Contenuto:</strong></p>
      <blockquote>${post.content.slice(0, 300)}${post.content.length > 300 ? '…' : ''}</blockquote>
      <p><a href="${process.env.SITE_URL}/admin/forum">Vai al pannello admin →</a></p>
    `,
  });
});