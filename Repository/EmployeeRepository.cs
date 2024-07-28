using Contract;
using Dapper;
using Entities;
using StaticManuLayout.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class EmployeeRepository : IEmployee
    {
        private readonly ApplicationDbContext _db;
        public EmployeeRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<List<Employee>> GetEmployee()
        {
            var query = "select * from Employee";
            using (var connection = _db.CreateConnection())
            {
                var employee = await connection.QueryAsync<Employee>(query);
                return employee.ToList();
            }
        }

        public async Task<List<LoginViewModel>> GetUsr()
        {
            var query = "SELECT * FROM UserInfo";
            try
            {
                using (var connection = _db.CreateConnection())
                {
                    var employees = await connection.QueryAsync<LoginViewModel>(query);
                    return employees.ToList();
                }
            }
            catch (Exception ex)
            {
               
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw; 
            }
        }

    }
}
