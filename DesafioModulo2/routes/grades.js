import express from 'express';
import { promises } from 'fs';
import cors from 'cors';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.get('/', cors(), async (_, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    logger.info('GET /grade');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade - ${err.message}`);
  }
});

router.get('/:id', cors(), async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const grade = json.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );
    if (grade) {
      res.send(grade);
      logger.info(`GET /grade/:id - ${JSON.stringify(grade)}`);
    } else {
      res.end();
      logger.info('POST /grade/:id');
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade/:id - ${err.message}`);
  }
});

router.post('/', async (req, res) => {
  let grade = req.body;
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    grade.timestamp = Date();

    grade = { id: json.nextId++, ...grade };
    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(grade);

    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grade - ${err.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let grades = json.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );
    json.grades = grades;

    await writeFile(global.fileName, JSON.stringify(json));

    res.end();

    logger.info(`DELETE /grade/:id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /grade - ${err.message}`);
  }
});

router.put('/', async (req, res) => {
  try {
    let newgrade = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.grades.findIndex((grade) => grade.id === newgrade.id);

    json.grades[oldIndex].student = newgrade.student;
    json.grades[oldIndex].subject = newgrade.subject;
    json.grades[oldIndex].type = newgrade.type;
    json.grades[oldIndex].value = newgrade.value;

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(json.grades[oldIndex]);

    logger.info(`PUT /grade - ${JSON.stringify(newgrade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /grade - ${err.message}`);
  }
});

router.post('/notatotal', async (req, res) => {
  try {
    let params = req.body;
    let data = await readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);

    let grades = json.grades.filter(
      (grade) =>
        grade.subject === params.subject && grade.student === params.student
    );

    if (grades) {
      const totalNota = grades.reduce((accumulator, current) => {
        return accumulator + current.value;
      }, 0);

      res.send(
        `Student: ${params.student} - Subject: ${params.subject} - Nota: ${totalNota}`
      );
    } else {
      res.end();
    }

    logger.info(`POST /grade/notatotal - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grade/notatotal - ${err.message}`);
  }
});

router.post('/notamedia', async (req, res) => {
  try {
    let params = req.body;
    let data = await readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);

    let grades = json.grades.filter(
      (grade) => grade.subject === params.subject && grade.type === params.type
    );

    if (grades) {
      const totalNota = grades.reduce((accumulator, current) => {
        return accumulator + current.value;
      }, 0);

      const qtdeNota = grades.length;
      const mediaNota = totalNota / qtdeNota;

      res.send(
        `Type: ${params.type} - Subject: ${params.subject} - Total Nota: ${totalNota} - Qtde. Nota: ${qtdeNota} - Média Nota: ${mediaNota}`
      );
    } else {
      res.end();
    }

    logger.info(`POST /grade/notamedia - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grade/notamedia - ${err.message}`);
  }
});

router.post('/notatop', async (req, res) => {
  try {
    let params = req.body;
    let data = await readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);

    let grades = json.grades.filter(
      (grade) => grade.subject === params.subject && grade.type === params.type
    );

    if (grades) {
      let bestGrades = grades
        .sort((a, b) => {
          return b.value - a.value;
        })
        .slice(0, 3);

      res.send(bestGrades);
    } else {
      res.end();
    }

    logger.info(`POST /grade/notatop - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grade/notatop - ${err.message}`);
  }
});

export default router;
