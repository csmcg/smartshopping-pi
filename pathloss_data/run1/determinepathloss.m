close all;
files = {'0_1meters'; '0_2meters'; '0_3meters'; '0_4meters'; '0_5meters';
    '0_6meters'; '0_7meters'; '0_8meters'; '0_9meters'; '1_0meters';
    '1_5meters'; '2_0meters'; '2_5meters'; '3_0meters'};
distance = [.1 .2 .3 .4 .5 .6 .7 .8 .9 1 1.5 2 2.5 3];
19.4.3 Simpson’s 3∕8 Rule
In a similar manner to the derivation of the trapezoidal and Simpson’s 1∕3 rule, a third-
order Lagrange polynomial can be fit to four points and integrated to yield
I = ___
3h  ​​ [ f (x 0 ) + 3f (x 1 ) + 3 f (x 2 ) + f (x 3 )]
8
where h = (b − a)∕3. This equation is known as Simpsons 3∕8 rule because h is multiplied
by 3∕8. It is the third Newton-Cotes closed integration formula. The 3∕8 rule can also be
expressed in the form of Eq. (19.13):
f (x ) + 3 f (x 1 ) + 3 f (x 2 ) + f (x 3 )
_________________________
I = (b − a)    
0
  
 ​​
8
(19.28)
Thus, the two interior points are given weights of three-eighths, whereas the end points are
weighted with one-eighth. Simpson’s 3∕8 rule has an error of
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