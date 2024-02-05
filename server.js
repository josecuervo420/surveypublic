const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json

// Dummy email transporter configuration - replace with real SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

app.post('/submit-quiz', (req, res) => {
    const responses = req.body;
    const clusterScores = calculateClusterScores(responses);
    const dominantCluster = determineDominantCluster(clusterScores);

    // Construct email content
    let emailContent = `Your dominant communication style is: ${dominantCluster}\n`;
    emailContent += "Based on your results, we recommend the following chapters:\n";

    // Add recommendations based on dominantCluster
    if (Array.isArray(dominantCluster)) {
        dominantCluster.forEach(cluster => {
            emailContent += getRecommendationForCluster(cluster);
        });
    } else {
        emailContent += getRecommendationForCluster(dominantCluster);
    }

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@gmail.com',
        subject: 'Your Communication Style Quiz Results',
        text: emailContent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.json({ dominantCluster });
});

function calculateClusterScores(responses) {
    let scores = { cruel: 0, unfeeling: 0, blamer: 0, bemoaner: 0 };

    for (const [key, value] of Object.entries(responses)) {
        const questionNumber = parseInt(key.substring(1)); // Assuming keys like q1, q2, ...
        const clusterIndex = Math.ceil(questionNumber / 5) - 1;
        const clusterKeys = ['cruel', 'unfeeling', 'blamer', 'bemoaner'];
        if (value >= 4) {
            scores[clusterKeys[clusterIndex]]++;
        }
    }
    return scores;
}

function determineDominantCluster(scores) {
    let maxScore = 0;
    let dominantClusters = [];

    for (const [cluster, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            dominantClusters = [cluster];
        } else if (score === maxScore) {
            dominantClusters.push(cluster);
        }
    }

    return dominantClusters.length === 1 ? dominantClusters[0] : dominantClusters;
}

function getRecommendationForCluster(cluster) {
    switch(cluster) {
        case 'cruel':
            return "Chapter 11: Caring with Your Words\n";
        case 'unfeeling':
            return "Chapter 12: Sensitive with Your Words\n";
        case 'blamer':
            return "Chapter 13: Responsible for Your Words\n";
        case 'bemoaner':
            return "Chapter 14: Resilient with Your Words\n";
        default:
            return "";
    }
}

app.listen(port, () => {
    console.log(`Quiz app listening at http://localhost:${port}`);
});
