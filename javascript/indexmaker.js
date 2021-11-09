/**
 * @param {NodeList} headers h1,h2,h3の配列
 * @param {Element} target indexを書き込む対象のElement
 */
function create_index(headers, target) {
    let bigheader_index = 0;

    for (let index = 0; index < headers.length; index++) {
        const element = headers.item(index);

        let link = document.createElement('a');
        link.href = '#' + element.id;
        link.textContent = element.textContent;
        target.append(link);

        if (element.tagName == 'H1') {
            link.href = '#';
        } else if (element.tagName == 'H2') {
            bigheader_index += 1;
        } else {
            link.className = 'subindex' + bigheader_index;
            link.hidden = true;
        }
    }
}

function subindex_hide_controll(index, True_or_False) {
    const targets = document.getElementsByClassName('subindex' + index);
    for (let target_index = 0; target_index < targets.length; target_index++) {
        const target = targets[target_index];
        target.hidden = True_or_False;
    }
}

function set_subindex_invisible(index) { subindex_hide_controll(index, true); }

function set_subindex_visible(index) { subindex_hide_controll(index, false); }

function controll_index(turning_positions, visible_flag) {
    window_pos = window.scrollY;
    screen_size = screen.height;

    for (let index = 0; index < visible_flag.length - 1; index++) {
        const this_position = turning_positions[index];
        const next_position = turning_positions[index + 1];

        if (visible_flag[index] && (window_pos + screen_size < this_position || next_position < window_pos)) {
            visible_flag[index] = 0;
            set_subindex_invisible(index);
        }
        if (!visible_flag[index] && this_position < window_pos + screen_size && window_pos < next_position) {
            visible_flag[index] = 1;
            set_subindex_visible(index);
        }
    }
}

/** subindexの表示を切り替える場所のY座標を求める */
function search_turning_points() {
    const big_headers = document.querySelectorAll('h2');
    let result = [0];

    for (let index = 0; index < big_headers.length; index++) {
        const header = big_headers[index];
        result.push(Math.round(header.getBoundingClientRect().top + window.scrollY));
    }

    result.push(document.documentElement.scrollHeight);

    return result;
}

function indexmaker() {
    const headers = document.querySelectorAll('h1,h2,h3');
    let target = document.getElementById('index');
    create_index(headers, target);

    let turning_positions = search_turning_points();
    let visible_flag = new Array(turning_positions.length).fill(false);

    let index_controller = controll_index.bind(null, turning_positions, visible_flag);
    index_controller();
    window.addEventListener('scroll', index_controller, false);
}

window.addEventListener('load', indexmaker, false);