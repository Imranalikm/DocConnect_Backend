import nodemailer from 'nodemailer'

export default function sentMail(email, message1, message2){
    return new Promise((resolve, reject)=>{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
      
            var mailOptions={
              from: process.env.EMAIL,
              to: email,
              subject: "DocConnect",
              html: `
              <h1>DocConnect</h1>
                <h2>${message1}</h2>
                <h3>${message2}</h3>
              `,
            }
        
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log("error", error, info)
                reject(error)

              } else {
                console.log("success")
                resolve({success:true, message:"Email sent successfull"})
              }
            });
    })
}
