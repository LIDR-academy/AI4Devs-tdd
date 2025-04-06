class MockFormData {
    append = jest.fn();
}

global.FormData = MockFormData as any; 