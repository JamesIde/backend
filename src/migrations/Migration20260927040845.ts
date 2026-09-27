import { Migration } from '@mikro-orm/migrations';

export class Migration20260927040845 extends Migration {

  override name = 'Migration20260927040845';

  override up(): void | Promise<void> {
    this.addSql(`create table [user] ([id] uniqueidentifier not null, [created_at] datetime2 not null, [updated_at] datetime2 not null, [last_updated_by] nvarchar(255) not null, [first_name] nvarchar(255) not null, [last_name] nvarchar(255) not null, constraint [user_pkey] primary key ([id]));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`if object_id('[user]', 'U') is not null drop table [user];`);
  }

}
