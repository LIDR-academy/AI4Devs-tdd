export const mockCandidateData = {
    basic: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "612345678",
        address: "Test Address"
    },
    
    complete: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "612345678",
        address: "Test Address",
        educations: [{
            institution: "Test University",
            title: "Test Degree",
            startDate: "2020-01-01",
            endDate: "2024-01-01"
        }],
        workExperiences: [{
            company: "Test Company",
            position: "Test Position",
            startDate: "2024-01-01"
        }],
        cv: {
            filePath: "test.pdf",
            fileType: "application/pdf"
        }
    }
}; 