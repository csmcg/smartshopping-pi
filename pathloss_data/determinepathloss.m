close all;
files = {'0_1meters'; '0_2meters'; '0_3meters'; '0_4meters'; '0_5meters';
    '0_6meters'; '0_7meters'; '0_8meters'; '0_9meters'; '1_0meters';
    '1_5meters'; '2_0meters'; '2_5meters'; '3_0meters'};
distance = [.1 .2 .3 .4 .5 .6 .7 .8 .9 1 1.5 2 2.5 3];

rssis = {};

for file = [1 : 1 : length(files)]
    fid = fopen(files{file, 1}, 'r');
    counter = 1;
    readings = [];
    while(~feof(fid))
        line = str2num(fgets(fid));
        readings(counter) = line;
        counter = counter + 1;
    end
    rssis{file} = readings;    
end



for index = [1 : 1 : length(rssis)]
    avg(index) = mean(rssis{1,index});
    variance(index) = var(rssis{1,index});
    stddev(index) = std(rssis{1,index});
end

%semilogy(distance, avg, 'scatter', 'xr');


[fittedmodel, gof] = createFit(distance, avg); % edit the fitted model w/ curve fitting app. then regen code from the fit session
e = errorbar(distance, avg, stddev, 'xb');
hold on;
fitted = plot(fittedmodel, '-.k');
grid on;
set(gca, 'YScale', 'log');
set(e, 'MarkerEdgeColor', 'r');

xlim([0, 3.5]);
ylim([-70, -25]);
legend(gca, 'Average RSSIs (w/ stddev)', 'Fit');
xlabel('Distance (m)');
ylabel('RSSI (dBm)');
anno_str = {'n = 1.831', 'RSSI @ 1m = -50.5801 dBm'};
annotation('textbox',[.5 .2 .3 .3], 'String', anno_str, 'FitBoxToText', 'on');
legend('FontSize',10);