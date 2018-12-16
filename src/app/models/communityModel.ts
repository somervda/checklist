export class CommunityModel {
  public id: string;
  public name: string;
  public description: string;
  public status: string;

  loadFromObject(data, id) {
    this.name = data.name;
    this.description = data.description;
    this.id = id;
    this.status = data.status;
  }
}
