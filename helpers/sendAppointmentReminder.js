import nodemailer from 'nodemailer'

export default function sendAppointmentReminder(email, date, time, doctor){
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
              html: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Document</title>
                  <style>
                    body {
                      margin-top: 50px;
                    }
                    .mail-seccess {
                      text-align: center;
                      background: #fff;
                      border-top: 1px solid #eee;
                    }
                    .mail-seccess .success-inner {
                      display: inline-block;
                    }
                    .mail-seccess .success-inner h1 {
                      font-size: 100px;
                      text-shadow: 3px 5px 2px #3333;
                      color: #006dfe;
                      font-weight: 700;
                    }
                    .mail-seccess .success-inner h1 span {
                      display: block;
                      font-size: 25px;
                      color: #333;
                      font-weight: 600;
                      text-shadow: none;
                      margin-top: 20px;
                    }
                    .mail-seccess .success-inner p {
                      padding: 20px 15px;
                    }
                    .mail-seccess .success-inner .btn {
                      color: #fff;
                    }
                  </style>
                </head>
              
                <body>
                  <link
                    href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css"
                    rel="stylesheet"
                    id="bootstrap-css"
                  />
                  <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
                  <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
                  <link
                    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                    rel="stylesheet"
                  />
                  <section class="mail-seccess section">
                    <div class="container">
                      <div class="row d-flex justify-content-center flex-row">
                        <div class="col-lg-12 offset-lg-3 col-12">
                          <!-- Error Inner -->
                          <div class="success-inner">
                            <h1>
                              <i class="fa fa-envelope"></i
                              ><span>DocOnline Appointment Reminder</span>
                            </h1>
                            <p style="max-width: 500px">
                              This is just a kindly reminder that you have an appointment on ${date}, ${time} with ${doctor}. We appreciate
                              your time and look forward to seeing you then! Please note that
                              we do not accept changes or cancellations via eral.
                            </p>
                            <a
                              href="https://docconnect-six.vercel.app"
                              class="btn btn-primary btn-lg"
                              >Go to DocConnect</a
                            >
                          </div>
                          <!--/ End Error Inner -->
                        </div>
                      </div>
                    </div>
                  </section>
                </body>
              </html>
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
