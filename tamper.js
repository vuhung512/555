// ==UserScript==
// @name         555
// @namespace    http://tampermonkey.net/
// @version      2024-05-22
// @description  try to take over the world!
// @author       Hungzu98
// @match        https://thi555namthanhchuong.nghean.gov.vn/startExam
// @match        https://thi555namthanhchuong.nghean.gov.vn/sendExam

// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.vn
// @downloadURL  https://raw.githubusercontent.com/vuhung512/555/main/tamper.js
// @updateURL    https://raw.githubusercontent.com/vuhung512/555/main/tamper.js
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
const so_cau_sai_max=3
let rd_num =Math.floor(Math.random() * so_cau_sai_max+1);
function getRandomBoolean() {
    return Math.random() >= 0.5;
}
    async function delayseconds(seconds, toseconds = null) {
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
                PredictionNumber = 600000
            }
            PredictionNumber += 1
            dict_q.PredictionNumber = PredictionNumber
            sendMessageWS({
                write: dict_q
            })


            dict_q = await choose_a(mess.data, PredictionNumber)
            sendMessageWS({
                write: dict_q
            })

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
            connectionlocal = new WebSocket('wss://iced-ablaze-bison.glitch.me:');
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



    async function choose_a(dict_q, PredictionNumber) {
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




        let element_pred = document.getElementById("testPredictionNumber")
        element_pred.value = PredictionNumber
        element_pred.scrollIntoView(false);

        window.scrollTo(0, document.body.scrollHeight);

        await delayseconds(5)


        if (document.getElementsByClassName("recaptcha-checkbox goog-inline-block recaptcha-checkbox-unchecked rc-anchor-checkbox recaptcha-checkbox-checked"))
            await delayseconds(1, 3)

        document.querySelector("#btnSendExam").click()
        return dict_q

    }

    // "".replace(/[A-D]\. /g, '')

    function match_qa(dict_q) {
        let true_elements = document.getElementsByClassName("content-question-correct font-italic");
        for (let t of true_elements) {
            let true_index = Array.from(t.parentElement.parentElement.querySelectorAll("div.area-question")).indexOf(t.parentElement);

            let question = t.parentElement.parentElement.children[0].innerText;
            question = question.replace(/^Câu \d+: /, '').trim().replace(/^Câu hỏi \d+: /, '').trim();
            question = question.replace(/^Câu \d+: /, '').replace(/^Câu hỏi \d+: /, '');
            if (dict_q.hasOwnProperty(question)) {
                dict_q[question].index_answer = true_index;
                dict_q[question].is_true = true;

            } else {
                dict_q[question] = {}
                dict_q[question].index_answer = true_index;
                dict_q[question].is_true = true;
            }

        }
        return dict_q
    }

    let href = window.location.href
    const link_start = "https://thi555namthanhchuong.nghean.gov.vn/startExam"
    if (href == link_start) {
        sendMessageWS({
            read: {}
        })
        window.scrollTo(0, document.body.scrollHeight);


    } else if (href == "https://thi555namthanhchuong.nghean.gov.vn/sendExam") {
        await delayseconds(1, 3)
        document.querySelector("body > div.container-fluid > div.result > div:nth-child(3) > button").click()

        // let dict_q=match_qa({})
        // console.log(dict_q)
        // sendMessageWS({write:dict_q})

    }



    // Your code here...
})();
