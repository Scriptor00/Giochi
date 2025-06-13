using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiochiPreferiti.Migrations
{
    /// <inheritdoc />
    public partial class AddInListaDesideriToGioco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "InListaDesideri",
                table: "Giochi",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InListaDesideri",
                table: "Giochi");
        }
    }
}
