import config from "../config/index.config";

import transporter from "../config/transporter.config";


const mailHelper = async (option)=>{
    const message = {
        from: config.SMTP_SENDER_EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }


    await transporter.sendMail(message);
}


export default mailHelper;