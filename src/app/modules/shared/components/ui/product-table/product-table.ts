import { Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[appTableHeader]',
  standalone: true
})
export class TableHeaderDirective {}

@Directive({
  selector: '[appTableRow]',
  standalone: true
})
export class TableRowDirective {}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.html',
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columnsCount: number = 1;
  @ContentChild(TableHeaderDirective, { read: TemplateRef }) headerTemplate!: TemplateRef<any>;
  @ContentChild(TableRowDirective, { read: TemplateRef }) rowTemplate!: TemplateRef<any>;
}
