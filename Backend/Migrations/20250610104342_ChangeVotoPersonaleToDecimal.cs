using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiochiPreferiti.Migrations
{
    /// <inheritdoc />
    public partial class ChangeVotoPersonaleToDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "VotoPersonale",
                table: "Giochi",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "VotoPersonale",
                table: "Giochi",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }
    }
}
