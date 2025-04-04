import { sendCandidateData } from '../services/candidateService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Send Candidate Data', () => {
  it('should send candidate data to the backend', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    mockedAxios.post.mockResolvedValue({
      data: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/candidates' },
    });

    // Act
    const result = await sendCandidateData(candidateData);

    // Assert
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith('/candidates', candidateData);
  });
});