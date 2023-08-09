import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { ItemSelectCheckboxValue } from "./select-checkbox.component";
import { RestPagination } from "@app/core";
import { SelectOptionsItem } from "../../../../types/select-options-item.model";
import { SortMeta } from "primeng/api";
import { UserAdminService } from "@app/shared/shared-users";

//TODO localize
//TODO Default Value No Users
//TODO If 'No Users' is selected than no other user should be get selected

@Component({
  selector: "my-select-users",
  styleUrls: ["./select-shared.component.scss"],
  templateUrl: "./select-users.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectUsersComponent),
      multi: true,
    },
  ],
})
export class SelectUsersComponent implements ControlValueAccessor, OnInit {
  @Input() maxUsers: number;

  selectedUsers: ItemSelectCheckboxValue[];
  availableUsers: (SelectOptionsItem & { groupOrder: number })[] = [];

  allUserGroup = `All Users`;

  // Fix a bug on ng-select when we update items after we selected items
  private toWrite: any;
  private loaded = false;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit() {
    var SortMeta: SortMeta = { field: "createdAt", order: 1 };
    var RestPagination: RestPagination = { count: 10, start: 0 };
    console.log("init");
    this.userAdminService
      .getUsers({
        pagination: RestPagination,
        sort: SortMeta,
        search: "",
      })
      .subscribe({
        next: (resultList) => {
          this.availableUsers = [
            {
              label: `Share with no User`,
              id: "-1",
              group: null,
              groupOrder: 0,
            },
          ];

          console.log(resultList);

          this.availableUsers = this.availableUsers.concat(
            resultList.data.map((user) => {
              return {
                label: user.username,
                id: user.id,
                group: this.allUserGroup,
                groupOrder: 1,
              };
            })
          );
        },
      });
    this.availableUsers.sort((a, b) => a.groupOrder - b.groupOrder);
    this.loaded = true;
    this.writeValue(this.toWrite);
  }

  propagateChange = (_: any) => {
    /* empty */
  };

  writeValue(users: ItemSelectCheckboxValue[]) {
    if (!this.loaded) {
      this.toWrite = users;
      return;
    }

    this.selectedUsers = users;
  }

  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    // Unused
  }

  onModelChange() {
    this.propagateChange(this.selectedUsers);
  }
}
