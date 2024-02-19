# AttendanceTracking NEAR Contract

The smart contract exposes four methods to enable, retrieving and delete a attendance in the NEAR network.

```ts
@NearBindgen({})
class AttendanceRecord {
    attended: UnorderedMap<attendace_model> = new UnorderedMap<attendace_model>('unique-id-map1');

    @call({})
    mark_attendance({ student_id, class_id }: { student_id: string, class_id: string }): void {
        const checker: AccountId = near.predecessorAccountId();
        const attendance: attendace_model = new attendace_model({ check: true, checker, class_id });
        this.attended.set(student_id, attendance);
        near.log(`Student ${student_id} attended class with enrollment ${class_id}. Reviewed by ${checker}`);
    }

    @view({})
    get_all_records({ student_id }: { student_id: string }): attendace_model {
      const record = this.attended.get(student_id);
      if(record){
        const msg = `The attendance records for student ${student_id} are: ${record}`;
        near.log(msg);
        return record; 
      }else{
        near.log(`The student ${student_id} doesn't have record`);
        return null;
      }     
    }

    @view({})
    has_attended({ student_id }: { student_id: string }): boolean {
        const attendance = this.attended.get(student_id);
        if(attendance){
          if(attendance.check){
            near.log(`The student ${student_id} does have attendance in ${attendance.class_id}`)
          }else{
            near.log(`The student ${student_id} doesn't have attendance in ${attendance.class_id}`)
          }
          return attendance.check
        }else{
          near.log(`The student ${student_id} doesn't have record`);
        return false;
        }
    }

    @call({})
    delete_attendance({ student_id, class_id }: { student_id: string, class_id:string }): boolean {
        const record = this.attended.get(student_id);
        let res = false;
        if(record.check && record.class_id == class_id){
          record.check = false;
          near.log(`Attendance record for student ${student_id} deleted successfully`);
          res = true;
        }else{
          near.log(`The student ${student_id} does not currently have assistance`)
          res = false;
        }
        return res;
    }
}
```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

3. Install dependencies:
```bash
npm install
```

4. You can run the tests to verify:
```bash
npm test
```

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
npm run build
npm run deploy
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
```

<br />

## 2. Recover history 

`get_all_records` is a read-only method (aka `view` method). to recover record the a student

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the attendance
near view <dev-account> get_all_records '{"student_id": "201004030"}'
```

<br />

## 3. Store a New attendance
`mark_attendance` changes the contract's state, for which it is a `call` method.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Use near-cli to set a new attendance
near call <dev-account> mark_attendance '{"student_id":"201140030", "class_id": "24563"}' --accountId <dev-account>
```

<br>

## 4. Delete a  attendance
`delete_attendance` changes the contract's state, for which it is a `call` method.

```bash
# Use near-cli to delete a attendance
near call <dev-account> delete_attendance '{"student_id":"201140030", "class_id": "24563"}' --accountId <dev-account>
```

<br>

## 5. Retrieve the attendance

`has_attended` is a read-only method (aka `view` method).

```bash
# Use near-cli to get the attendance
near view <dev-account> has_attended '{"student_id": "201140030"}'
```

**Tip:** If you want to call a call method using your own account, first log in to NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <your-account>`.