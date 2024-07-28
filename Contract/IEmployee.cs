using Entities;
using StaticManuLayout.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract
{
    public interface IEmployee
    {
        public Task<List<Employee>> GetEmployee();
        public  Task<List<LoginViewModel>> GetUsr();
    }
}
