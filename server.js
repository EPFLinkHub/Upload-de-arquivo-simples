const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('files', 12);

// Rota principal
app.get('/', (req, res) => {
    res.render('index');
});

// Rota de upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: "Something went wrong during the upload." });
        }

        const filesUploaded = req.files.length;
        const message = `${filesUploaded} file${filesUploaded !== 1 ? 's' : ''} uploaded successfully.`;

        res.status(200).json({ message });
    });
});

// Inicia o servidor na porta 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});