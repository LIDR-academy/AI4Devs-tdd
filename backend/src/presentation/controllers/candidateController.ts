import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidate } from '../../application/services/candidateService';

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
    },

    getCandidate: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const candidate = await findCandidateById(id);

            if (!candidate) {
                return res.status(404).send({ message: "Candidate not found" });
            }

            res.status(200).send(candidate);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).send({ message: "An unexpected error occurred" });
            }
        }
    },

    updateCandidate: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await updateCandidate(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).send({ message: "An unexpected error occurred" });
            }
        }
    }
};
