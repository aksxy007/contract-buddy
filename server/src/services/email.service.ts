import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendPremiumConfirmationEmail = async(
    userEmail:string,
    userName:string,
)=>{
    try {
        await resend.emails.send({
            from:"ContractBuddy <onboarding@resend.dev>",
            to:userEmail,
            subject:"Welcome to Premium",
            html:`<h2> Hi ${userName} </h2>,<p> Welcome to premium. You're now a Premium User.Explore the power of AI with full potential! </p>`
        })
    } catch (error) {
        console.error(error);
    }
}

