import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';
import {attendace_model} from './model'



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
