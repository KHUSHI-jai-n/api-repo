const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper Functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const processData = (data) => {
    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;

    data.forEach((item) => {
        if (/^\d+$/.test(item)) {
            numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (item >= 'a' && item <= 'z') {
                if (!highestLowercase || item > highestLowercase) {
                    highestLowercase = item;
                }
            }
        }
    });

    return { numbers, alphabets, highestLowercase };
};

// Routes
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid 'data' format" });
        }

        // Process input data
        const { numbers, alphabets, highestLowercase } = processData(data);
        const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

        // File validation
        let fileValid = false;
        let fileMimeType = null;
        let fileSizeKB = null;

        if (file_b64) {
            try {
                const buffer = Buffer.from(file_b64, 'base64');
                fileValid = true;
                fileMimeType = mime.getType(buffer);
                fileSizeKB = (buffer.length / 1024).toFixed(2);
            } catch (error) {
                fileValid = false;
            }
        }

        // Respond
        res.status(200).json({
            is_success: true,
            user_id: "john_doe_17091999",
            email: "john@xyz.com",
            roll_number: "ABCD123",
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
            is_prime_found: isPrimeFound,
            file_valid: fileValid,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKB,
        });
    } catch (error) {
        res.status(500).json({ is_success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
