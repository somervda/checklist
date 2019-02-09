import { ChecklistStatus } from "./../models/checklistModel";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

// store values that user has used for filters
export class FilterstoreService {
  myChecklistFilters: {
    selectedOwnership: string;
    selectedStatus: number;
    selectedAge: number;
    selectedCategory: { id: string; name: string };
    selectedTheme: { id: string; name: string };
    lockFilterOpen: boolean;
  };

  ChecklistStatus = ChecklistStatus;

  constructor() {
    this.resetFilters();
  }

  resetFilters() {
    this.myChecklistFilters = {
      selectedOwnership: "All",
      selectedStatus: ChecklistStatus.Active,
      selectedAge: -1,
      selectedCategory: { id: "-1", name: "All" },
      selectedTheme: { id: "", name: "" },
      lockFilterOpen: false
    };
    console.log("FilterstoreService reset", this.myChecklistFilters);
  }
}
