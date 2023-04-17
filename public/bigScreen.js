
document.getElementById('surveyForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const language = document.querySelector('input[name="language"]:checked');
    if (language) {
        const barId = `bar${language.value}`;
        const barElement = document.getElementById(barId);
        const currentValue = parseInt(barElement.getAttribute('data-value'));
        const newValue = currentValue + 1;
        barElement.setAttribute('data-value', newValue);
        barElement.style.height = `${newValue * 20}px`;
    }
});
