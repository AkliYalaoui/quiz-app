var bullets  = document.querySelector('.bullet-container');
var question = document.querySelector('.quiz-area h2');
var question_option = document.querySelectorAll('.answer');
var current_question = 0;
var allQuetsion;
var number_of_question;
var right_answers = 0;
var btn_submit = document.querySelector('.submit');
var results = document.getElementById('results');
var minutes_timer = document.querySelector('.count-down .minutes');
var seconds_timer = document.querySelector('.count-down .seconds');
var timer;
var user_quiz_history = [];

function getQuestion(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","./quiz.json",true);
    xhr.onload = function(){
        if(this.status  === 200){
            allQuetsion = JSON.parse(this.responseText);
            number_of_question  = allQuetsion.length;
            create_bullets(number_of_question);
            add_data(allQuetsion[current_question]);
            count_down_timer(10);
        }
    };
    xhr.send();
}
function create_bullets(nb){
    document.querySelector('.quiz-info .count span').textContent = nb;
    for(var i=0;i<nb;i++){
        var bullet = document.createElement('span');
        bullets.appendChild(bullet);
    }
    bullets.firstElementChild.className = 'active';
}
function add_data(qst){
    question.textContent = qst.title;
    var i =  1;
    for(el of question_option){
        var quest = qst['answer_' + i];
        el.firstElementChild.dataset.answer = quest ;
        el.lastElementChild.textContent = quest;
        i++;
    }
}
function show_result(){
    bullets.parentElement.remove();
    btn_submit.remove();
    question_option[0].parentElement.remove();
    question.parentElement.remove();
    
    var mention = document.createElement('span');
    var mentionText;
    if(right_answers < 5){
        mention.className = "bad";
        mentionText = document.createTextNode('BAD');
    }else if(right_answers < 10){
        mention.className = "good";
        mentionText = document.createTextNode('GOOD');
    }else if(right_answers == 10){
        mention.className = "perfect";
        mentionText = document.createTextNode('PERFECT');
    }
    var msg = document.createTextNode('  You Got ' + right_answers +' Out Of '+10);
    mention.appendChild(mentionText);
    results.appendChild(mention);
    results.appendChild(msg);
    creat_history();
    results.style.display = "block";
}
function count_down_timer(duration){
    timer = setInterval(function(){
        var min = parseInt(duration / 60);
        var sec = duration % 60;
        minutes_timer.textContent = min < 10 ? "0"+min : min;
        seconds_timer.textContent = sec < 10 ? "0"+sec : sec;
        duration--;
        if(duration == 0){
            btn_submit.click();
        }
    },1000)
    
}
function push_to_history(qst_obj){
    user_quiz_history.push(qst_obj);
}
function creat_history(){
    for(qst_ob of user_quiz_history){
        var user_qst_hist = document.createElement('div');
            user_qst_hist.className = "user-qst-hist";

        var h4_title = document.createElement('h4');
            h4_title.appendChild(document.createTextNode(qst_ob.question));

        var user_answer = document.createElement('div');
        var span_user_answer = document.createElement('span');
            span_user_answer.appendChild(document.createTextNode('Your Answer : '));
            user_answer.appendChild(span_user_answer);
            user_answer.appendChild(document.createTextNode(qst_ob.user_answer));
            user_answer.className = qst_ob.is_right == false ? "bad":"good";

        var qst_good_answer = document.createElement('div');
        var span_right_answer = document.createElement('span');
            span_right_answer.appendChild(document.createTextNode('Right Answer : '));
            qst_good_answer.appendChild(span_right_answer);
            qst_good_answer.appendChild(document.createTextNode(qst_ob.good_anwer));

        user_qst_hist.appendChild(h4_title);
        user_qst_hist.appendChild(user_answer);
        user_qst_hist.appendChild(qst_good_answer);

        results.appendChild(user_qst_hist);
    }    
}
btn_submit.onclick = function(){
    clearInterval(timer);
    count_down_timer(10);
    var rt_answ = allQuetsion[current_question]['right_answer'];
    var usr_answ = document.querySelector('.answer-area input[type="radio"]:checked').dataset.answer;
    push_to_history({
        question    : allQuetsion[current_question]['title'],
        user_answer : usr_answ,
        good_anwer  : rt_answ,
        is_right    : usr_answ == rt_answ ? true:false
    });
    if( rt_answ === usr_answ ){
        right_answers++;
    }
    current_question ++;
    if(current_question < number_of_question){
        add_data(allQuetsion[current_question]);
        bullets.querySelectorAll('span')[current_question].className = "active";
    }else{
        clearInterval(timer);
        show_result();
    } 
};
getQuestion();