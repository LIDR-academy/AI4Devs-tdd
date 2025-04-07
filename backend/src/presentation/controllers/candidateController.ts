import { Request, Response } from 'express';
import { addCandidate } from '../../application/services/candidateService';

export const candidateController = {
  addCandidate: async (req: Request, res: Response) => {
    try {
      // console.log(req.body); //Just in case you want to inspect the request body
      const result = await addCandidate(req.body);
      res.status(201).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "An unexpected error occurred" });
      }
    }
  }
};
