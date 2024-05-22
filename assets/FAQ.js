
    var toggleIcons = document.querySelectorAll('.toggle-icon');

    toggleIcons.forEach(function (icon) {
        icon.addEventListener('click', function () {
            var questionContainer = icon.parentElement;
            var answerContainer = questionContainer.nextElementSibling;

            answerContainer.classList.toggle('active');
            questionContainer.classList.toggle('open');

            var allQuestionContainers = document.querySelectorAll('.questionContainer');
            var allAnswerContainers = document.querySelectorAll('.answerContainer');

            allQuestionContainers.forEach(function (container){
                if (container !== questionContainer){
                    container.classList.remove('open'); 
                }
            });
            allAnswerContainers.forEach(function (container) {
                if (container !== answerContainer) {
                    container.classList.remove('active');
                }
            });
            
            
        });
    });
