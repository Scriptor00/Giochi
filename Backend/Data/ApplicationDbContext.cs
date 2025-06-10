using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GiochiPreferiti.Models;
using Microsoft.EntityFrameworkCore;

namespace GiochiPreferiti.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Gioco> Giochi { get; set; }
    }
}