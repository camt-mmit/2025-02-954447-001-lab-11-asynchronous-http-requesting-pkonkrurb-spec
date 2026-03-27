import { ChangeDetectionStrategy, Component, Injector, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { Person } from '../../types';

@Component({
  selector: 'app-people-list',
  // RouterLink: ใช้สำหรับทำ Link เชื่อมไปยังหน้าอื่น (เช่น คลิกที่ชื่อแล้วไปหน้า Profile)
  // ExtractIdPipe: เป็น Custom Pipe ที่คุณสร้างขึ้นเพื่อดึง ID ออกจากข้อมูล Person
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  // OnPush: ช่วยให้ Component อัปเดตเฉพาะเมื่อข้อมูล 'data' เปลี่ยนแปลงเท่านั้น (ประหยัดทรัพยากร)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  /**
   * รับอาเรย์ของข้อมูล Person จาก Component ภายนอก
   * ใช้ Signal Input (input.required) ทำให้ข้อมูลนี้เป็นแบบ Read-only และ Reactive
   */
  readonly data = input.required<readonly Person[]>();

  /**
   * Injector: เป็นตัวจัดการการฉีด Dependency ของ Angular
   * แม้ตอนนี้ในโค้ดจะยังไม่ได้เรียกใช้ตัวแปรนี้ด้านล่าง
   * แต่การประกาศไว้แบบนี้มักใช้เพื่อเตรียมทำ Dynamic Component หรือส่งต่อ context ให้ฟังก์ชันอื่น
   */
  private readonly injector = inject(Injector);
}
