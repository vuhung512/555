// ==UserScript==
// @name         555
// @namespace    http://tampermonkey.net/
// @version      2024-05-22
// @description  try to take over the world!
// @author       Hungzu98
// @match        https://thi555namthanhchuong.nghean.gov.vn/startExam
// @match        https://thi555namthanhchuong.nghean.gov.vn/sendExam

// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.vn

// @grant        none
// ==/UserScript==
(async function() {
    
    'use strict';
const time_delay=[25,30];

const so_cau_sai_max=3
let  url_sv ="https://torpid-jealous-tartan.glitch.me/"
url_sv=url_sv.split("/")[2]
let rd_num =Math.floor(Math.random() * so_cau_sai_max+1);
function getRandomBoolean() {
    return Math.random() >= 0.5;
}
    async function delayseconds(seconds, toseconds = null) {
        return
        if (toseconds) {
            seconds = Math.floor(Math.random() * (toseconds - seconds + 1)) + seconds;
        }
        return new Promise(resolve => {
            const timeout = setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }
    async function delay(seconds, toseconds = null) {
        if (toseconds) {
            seconds = Math.floor(Math.random() * (toseconds - seconds + 1)) + seconds;
        }
        return new Promise(resolve => {
            const timeout = setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }

  
    async function match_ws_return(mess) {
        if (mess.data) {
            let dict_q = mess.data
            let PredictionNumber = dict_q.PredictionNumber
            if (!PredictionNumber) {
                PredictionNumber = 70000
            }
            let href = window.location.href
    if (href == "https://thi555namthanhchuong.nghean.gov.vn/sendExam") {
        var modal = document.getElementById('sendExamModalError');
        if (modal){
            if ( modal.style.display === 'block'){ //err
                restartExam();
    
            }
            else{
                        PredictionNumber += 1
                        dict_q.PredictionNumber = PredictionNumber
                        sendMessageWS({write: dict_q})
                        restartExam();
            }
        }
      
    }

    if (href == "https://thi555namthanhchuong.nghean.gov.vn/startExam") {
        let CaptchaText = mess.CaptchaText
        if (CaptchaText){
            dict_q = await choose_a(mess.data, PredictionNumber,CaptchaText)
            sendMessageWS({
                write: dict_q
            })
        }
        else {
            restartExam();

        }
}

         

        }
    }
    let connectionlocal = null;

    function connectWebSocket() {
        if (!(connectionlocal) || connectionlocal.readyState === 3) {
            if (connectionlocal) {
                connectionlocal.onmessage = null;
                connectionlocal.onclose = null;
                connectionlocal.onopen = null;
            }
            connectionlocal = new WebSocket('wss://'+url_sv+':');
            var pingInterval = null;
            connectionlocal.onopen = function() {
                console.log('WebSocket connected!');
                pingInterval = setInterval(function() {
                    //  sendMessageWS({ text: "ping"});
                }, 60 * 1000);

            };
            connectionlocal.onmessage = async function(message) {
                message = message.data;
                const messjson = JSON.parse(message);
                console.log('New message:', messjson);
                await match_ws_return(messjson)

            };
            connectionlocal.onclose = function(event) {
                console.log("disconnected from glitch");

                if (pingInterval) {
                    clearInterval(pingInterval);
                }
                try {
                    connectWebSocket();
                } catch {}
                console.log("reconnecting");
            };
        }
    }
    connectWebSocket()

    function sendMessageWS(data) {
        connectWebSocket();

        function sendWhenReady() {
            if (connectionlocal && connectionlocal.readyState == 1) {
                connectionlocal.send(JSON.stringify(data));
            } else {
                console.log("not ready connect");
                setTimeout(sendWhenReady, 100);
            }
        }
        sendWhenReady();
    }



    async function choose_a(dict_q, PredictionNumber,CaptchaText) {
        if (CaptchaText){
            console.log(CaptchaText)
                document.querySelector("#recaptchaResponse").value= CaptchaText
    
              
            }
            else {
            restartExam();
                
                // window.location.href = "https://thi555namthanhchuong.nghean.gov.vn/startExam"
            }
        let element_pred = document.getElementById("testPredictionNumber")
        element_pred.value = PredictionNumber
        element_pred.scrollIntoView();
        document.getElementById("countNum").value=20
        await delay(time_delay[0],time_delay[0])

        const elements = document.getElementsByClassName("title-lbl-question");
        const trimmedArray = Array.from(elements).slice(0, 20);
        let dem_causai=0
        for (let e of trimmedArray) {

            let answer_elements = e.parentElement.querySelectorAll("div.content-question.font-italic");
            let question = e.innerText.trim();
            question = question.replace(/^Câu \d+: /, '').trim().replace(/^Câu hỏi \d+: /, '').trim();
            let index_answer = 0
            if (dict_q.hasOwnProperty(question)) {
                if (dict_q[question].is_true = true) {
                    index_answer = dict_q[question].index_answer;
                } else {
                    index_answer += 1;
                    dict_q[question].index_answer = index_answer;
                }
            } else {
                dict_q[question] = {
                    index_answer: index_answer,
                    is_true: false
                };

             

            }

            answer_elements[index_answer].parentElement.querySelector("label>span").click();
            if (getRandomBoolean()) {
                if (dem_causai<rd_num){
                    dem_causai+=1
                    answer_elements[1].parentElement.querySelector("label>span").click(); // AUTO CHON B
                }
                

              } 

            document.querySelector("#TestForm > div.area-btn-next > a > button").click();
            await delayseconds(.3, .9)
            



        }
        window.scrollTo(0, document.body.scrollHeight);




    


        await delayseconds(5,10)

        
     
        document.querySelector("#btnSendExam").click()

       
    
        return dict_q

    }

    // "".replace(/[A-D]\. /g, '')
  
    // function match_qa(dict_q) {
    //     let true_elements = document.getElementsByClassName("content-question-correct font-italic");
    //     for (let t of true_elements) {
    //         let true_index = Array.from(t.parentElement.parentElement.querySelectorAll("div.area-question")).indexOf(t.parentElement);

    //         let question = t.parentElement.parentElement.children[0].innerText;
    //         question = question.replace(/^Câu \d+: /, '').trim().replace(/^Câu hỏi \d+: /, '').trim();
    //         question = question.replace(/^Câu \d+: /, '').replace(/^Câu hỏi \d+: /, '');
    //         if (dict_q.hasOwnProperty(question)) {
    //             dict_q[question].index_answer = true_index;
    //             dict_q[question].is_true = true;
    //             console.log(question,true_index)

    //         } else {
    //             dict_q[question] = {}
    //             dict_q[question].index_answer = true_index;
    //             dict_q[question].is_true = true;
    //             console.log(question,true_index)

    //         }

    //     }
    //     return dict_q
    // }

    let href = window.location.href
    const link_start = "https://thi555namthanhchuong.nghean.gov.vn/startExam"
    if (href == link_start) {
      
        // sendMessageWS({orc:src_captcha})
        let valueim = document.getElementById('realCaptcha').value;
        console.log(valueim);
        let base64Image = 'data:image/jpeg;base64,' + valueim;
        sendMessageWS({ read: {} ,base64Image:base64Image})


    } else if (href == "https://thi555namthanhchuong.nghean.gov.vn/sendExam") {
        sendMessageWS({ read: {}})

     

       

    }



})();
