using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiochiPreferiti.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentoPersonaleToGioco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommentoPersonale",
                table: "Giochi",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentoPersonale",
                table: "Giochi");
        }
    }
}
