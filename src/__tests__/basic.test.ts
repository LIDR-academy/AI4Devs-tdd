describe('Pruebas básicas de Jest', () => {
    test('suma de números', () => {
        expect(1 + 1).toBe(2);
    });

    test('comparación de strings', () => {
        expect('hola').toBe('hola');
    });

    test('verificación de objeto', () => {
        const obj = { nombre: 'test' };
        expect(obj).toEqual({ nombre: 'test' });
    });
}); 