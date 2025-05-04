import { Component, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  filters = [
    { label: 'Current Shift', value: 0 },
    { label: 'Last Shift', value: 1 },
    { label: 'Last Day', value: 2 },
    { label: 'Last Week', value: 3 },
    { label: 'Last Month', value: 4 }
  ];

  data = signal<any>(null);
  selectedDuration = signal(0);
  performancePercent = 0;
  availabilityPercent = 0;
  chartOptions: any;
  machineStopsTimelineOptions: any;

  constructor(private http: HttpClient) {
    this.loadData(0);
  }

  public performanceChartOptions: any;
  public availabilityChartOptions: any;


  loadData(duration: number) {
    const url = `http://196.219.184.42/Abdullatif_Backend/api/Machines/GetFillers?duration=${duration}`;
    this.http.get<any>(url).subscribe(res => {
      this.data.set(res);
      this.selectedDuration.set(duration);
      this.performancePercent = +(res.performance * 100).toFixed(2);
      this.availabilityPercent = +(res.availability * 100).toFixed(2);
      this.initCharts();
    });

    const url1 = `http://196.219.184.42/Abdullatif_Backend/api/Machines/GetDashboardData?duration=${duration}`;
    this.http.get<any>(url1).subscribe(res => {
      this.data.set(res);
      this.selectedDuration.set(duration);

      const timestamps = res.speed.time;
      const rpmValues = res.speed.values;



      // Prepare the chart data
      this.chartOptions = {
        series: [
          {
            name: 'AVG RPM',
            data: rpmValues
          }
        ],
        chart: {
          height: 350,
          type: 'line',
        },
        title: {
          text: 'AVG RPM Over Time',
          align: 'center'
        },
        xaxis: {
          categories: timestamps,
          labels: {
            rotate: -45
          }
        },
        yaxis: {
          title: {
            text: 'RPM'
          }
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy HH:mm'
          },
          y: {
            formatter: function (value: number) {
              return value.toFixed(2) + ' RPM';
            }
          }
        },
        stroke: {
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: '#f1f1f1'
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      };
    });
  }

  initCharts(): void {
    this.performanceChartOptions = this.buildChart(this.performancePercent, 'Performance');
    this.availabilityChartOptions = this.buildChart(this.availabilityPercent, 'Availability');
  }

  buildChart(value: number, label: string): any {
    return {
      series: [value],
      chart: {
        type: 'radialBar',
        height: 200
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            name: {
              offsetY: -10,
              show: true,
              color: '#7f8c8d',
              fontSize: '14px',
            },
            value: {
              fontSize: '22px',
              show: true,
              formatter: () => `${value}%`,
            },
          },
        },
      },
      labels: [label],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#007bff'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      }
    };
  }

}
