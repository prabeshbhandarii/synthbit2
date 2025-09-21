import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import template from './document/index.js';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';
import { json } from 'stream/consumers';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello there from server"
    });
});

app.post('/certificate', async (req, res) => {
    try {
        const name = req.body.name[0];
        const courseName = req.body.courseName[0];
        const courseStartDate = req.body.courseStartDate[0];
        const courseCompletionDate = req.body.courseCompletionDate[0];

        if (!name || !courseName || !courseStartDate || !courseCompletionDate) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const html = template({ name, courseName, courseStartDate, courseCompletionDate });

        const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const outputPath = path.resolve(`./certificates/${fileName}`);

        const dirPath = path.dirname(outputPath);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (!fs.existsSync(outputPath)) {
            fs.writeFileSync(outputPath, '');
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({ path: outputPath, format: 'A4', printBackground: true });

        await browser.close();

        const code = uuidv4()

        const dbCall = await prisma.certificate.create({
            data: {
                name,
                code,
                courseName,
                courseStartDate: new Date(courseStartDate),
                courseCompletionDate: new Date(courseCompletionDate),
                filePath: `/certificates/${fileName}`
            }
        })
        console.log(dbCall)
        if(!dbCall){
            return res.json({
                message: "sorry we could not store your file "
            })
        }

        return res.status(200).json({
            message: 'Certificate created',
            code: code,
            downloadUrl: `http://localhost:${process.env.PORT}/certificates/${fileName}`
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Failed to generate PDF',
            details: error.message
        });
    }
});

app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

app.get('/certificate', async (req, res) => {
    try {
        const { code } = req.body
        const response = await prisma.certificate.findUnique({
            where: {
                code: code
            }
        })
        if(!response){
            return res.json({
                message: 'could not find your certificate'
            })
        }
        return res.status(200).json({
            message: 'certificate found',
            data: response
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'internal server error',
        })
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
