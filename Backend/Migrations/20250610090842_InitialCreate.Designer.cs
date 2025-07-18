﻿// <auto-generated />
using System;
using GiochiPreferiti.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GiochiPreferiti.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250610090842_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GiochiPreferiti.Models.Gioco", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("Completato")
                        .HasColumnType("bit");

                    b.Property<DateTime>("DataPubblicazione")
                        .HasColumnType("datetime2");

                    b.Property<string>("Genere")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Piattaforma")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Trama")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UrlImmagine")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VotoPersonale")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Giochi");
                });
#pragma warning restore 612, 618
        }
    }
}
