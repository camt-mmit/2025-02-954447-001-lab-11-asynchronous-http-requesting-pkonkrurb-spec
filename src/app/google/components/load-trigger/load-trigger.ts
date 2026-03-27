import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-load-trigger',
  imports: [],
  templateUrl: './load-trigger.html',
  styleUrl: './load-trigger.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadTrigger implements OnInit {
  readonly visible = output<void>();

  ngOnInit(): void {
    this.visible.emit();
  }
}
