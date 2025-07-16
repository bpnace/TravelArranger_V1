import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { tripId, friendEmail, message } = await request.json();

  if (!locals.supabase) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // TODO: Replace with actual email service (SendGrid, Resend, etc.)
    // For now, simulate invitation creation
    
    const invitation = {
      id: `inv-${Date.now()}`,
      tripId,
      inviterEmail: locals.supabase.auth.getUser().then(user => user.data.user?.email),
      friendEmail,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // TODO: Send actual email invitation
    console.log('Sending invitation:', invitation);

    // Mock email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return json({
      success: true,
      invitationId: invitation.id,
      message: 'Invitation sent successfully!'
    });

  } catch (error) {
    console.error('Failed to send invitation:', error);
    return json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}; 