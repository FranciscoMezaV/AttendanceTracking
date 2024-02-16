import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';
import { attendace_model } from '../../src/model';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// Test para registrar asistencia

test('alumno123 registrar asistencia correctamente', async (t) => {
  const { root, contract } = t.context.accounts;
  const studentId = 'alumno123';
  const classId = 'clase456';

  // Registrar asistencia
  await root.call(contract, 'mark_attendance', { "student_id": studentId, "class_id": classId });

  // Obtener registro de asistencia
  const check = await contract.view("has_attended", { student_id: studentId });

  // Comparar el registro
  t.deepEqual(check, true);
});

test('alumno123 remover asistencia', async (t) => {
  const { root, contract } = t.context.accounts;
  const studentId = 'alumno123';
  const classId = 'clase456';

  await root.call(contract, 'mark_attendance', { "student_id": studentId, "class_id": classId });

  // Eliminar asistencia
  const res = await root.call(contract, 'delete_attendance', { "student_id": studentId, "class_id": classId });

  // Comparar el registro
  t.deepEqual(res, true);
});


test('Revisar historial de alumno alumno123', async (t) => {
  const { root, contract } = t.context.accounts;
  const studentId = 'alumno123';
  const classId = 'clase456';

  await root.call(contract, 'mark_attendance', { "student_id": studentId, "class_id": classId });

  // Obtener registro de asistencia
  const record = await contract.view("get_all_records", { student_id: studentId });
  const expect = {
    check: true || false,
    checker: root.accountId,
    class_id: classId,
  }
  // Comparar el registro
  t.deepEqual(record, expect);
});


