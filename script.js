document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    fetch('/submit-quiz', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert("Your dominant communication style is: " + data.dominantCluster);
    })
    .catch(error => console.error('Error:', error));
});
